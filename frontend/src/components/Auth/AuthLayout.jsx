import React from "react";

const AuthLayout = ({ title, tagline, image, alt = "auth", children }) => {
	return (
		<section className="auth-template">
			<div className="auth-tpl-left">
				<div className="auth-form-head">
					<h2>{title}</h2>
					{tagline ? <p>{tagline}</p> : null}
				</div>
				{children}
			</div>
			<div className="auth-tpl-right">
				<img src={image} alt={alt} />
			</div>
		</section>
	);
};

export default AuthLayout;

