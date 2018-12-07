import React from 'react'
import avatar from '../../../../assets/images/users/avatar-1.png'

export default ({ user, handleResetPass }) => (
  <form className="form-horizontal m-t-30" onSubmit={handleResetPass}>
    <div className="user-thumb text-center m-b-30">
      <img src={avatar} className="rounded-circle img-thumbnail" alt="thumbnail" />
      <h6>{user.name}</h6>
    </div>
    <div className="form-group">
      <label htmlFor="userpassword">Old Password</label>
      <input type="password" className="form-control" name="userpassword" id="userpassword" placeholder="Enter old password" />
    </div>
    <div className="form-group">
      <label htmlFor="newpassword">New Password</label>
      <input type="password" className="form-control" name="newpassword" id="newpassword" placeholder="Enter new password" />
    </div>
    <div className="form-group row m-t-20">
      <div className="col-12 text-right">
        <button className="btn btn-primary w-md waves-effect waves-light" type="submit">Change Password</button>
      </div>
    </div>
  </form>
)