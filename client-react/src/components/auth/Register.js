import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import {connect} from 'react-redux'
import {setAlert} from '../../actions/alert'
import {register} from '../../actions/auth'

import PropType from 'prop-types'
const Register = ({setAlert,register}) => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const { email, name, password, confirmPassword } = formData;
  const onChange = (e) =>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }
  const onSubmit = async(e)=>{
      e.preventDefault()
    if(password!== confirmPassword){
        setAlert('Password do not match','danger')
    }else{
        register({name,password,email})
    }
  }
  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"> Create Your Account</i>
      </p>
      <form className="form" onSubmit={e=>onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={e=>onChange(e)}
  
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Email address"
            name="email"
            value={email}
            onChange={e=>onChange(e)}
  
          />
          <small className="form-text">
            This site use gravatar if you want a profile image,use a Gravatar
            email.
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={e=>onChange(e)}
      
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e=>onChange(e)}
      
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register"/>
        <p className="my-1">
          Already have an account ? <Link to="/login">Sign In</Link>
        </p>
      </form>
    </Fragment>
  );
};

Register.propTypes ={
  setAlert : PropType.func.isRequired,
  register : PropType.func.isRequired
}

export default connect(null,{setAlert,register})(Register);
