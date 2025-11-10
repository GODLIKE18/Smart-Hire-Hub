import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Job } from '../models/jobSchema.js';
import { User } from '../models/userSchema.js';

dotenv.config({ path: './config/config.env' });

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'MERN_JOB_SEEKING_WEBAPP' });
    console.log('Connected to DB');

    const filter = {
      $or: [
        { companyName: { $exists: false } },
        { companyName: '' },
        { companyName: null },
      ],
    };

    const jobs = await Job.find(filter).lean();
    console.log(`Found ${jobs.length} jobs missing companyName`);

    let updated = 0;
    for (const j of jobs) {
      let name = 'Unknown Company';
      if (j.postedBy) {
        const user = await User.findById(j.postedBy).select('name').lean();
        if (user && user.name) name = user.name.trim();
      }
      await Job.updateOne({ _id: j._id }, { $set: { companyName: name } });
      updated++;
    }

    console.log(`Backfill complete. Updated ${updated}/${jobs.length} jobs.`);
  } catch (err) {
    console.error('Backfill failed:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

run();
