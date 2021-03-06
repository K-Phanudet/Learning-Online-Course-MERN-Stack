import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password} = formData;
  const onChange = (e) =>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }
  const onSubmit = async(e)=>{
    e.preventDefault()
    console.log('SUCCESS')
  }
  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"> Sign Into Your Account</i>
      </p>
      <form className="form" onSubmit={e=>onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Email address"
            name="email"
            value={email}
            onChange={e=>onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={e=>onChange(e)}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login"/>
        <p className="my-1">
          Don't have an account ? <Link to="/login">Sign Up</Link>
        </p>
      </form>
    </Fragment>
  );
};

export default Login;
