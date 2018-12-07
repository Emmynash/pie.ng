import React from 'react'

export default ({ data }) => (
  <div>
    <fieldset className="body current" role="tabpanel">
      <div className="row">
        <div className="col-md-6">
          <div className="form-group row">
            <label htmlFor="txtFirstNameBilling" className="col-lg-3 col-form-label">Business Name</label>
            <div className="col-lg-9">
              <input id="businessName" name="name" type="text" className="form-control" defaultValue={data.name || ''} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group row">
            <label htmlFor="txtLastNameBilling" className="col-lg-3 col-form-label">Mobile No.</label>
            <div className="col-lg-9">
              <input id="phone" name="phone" type="text" className="form-control" defaultValue={data.phone || ''} />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="form-group row">
            <label htmlFor="txtCompanyBilling" className="col-lg-3 col-form-label">Email Address</label>
            <div className="col-lg-9">
              <input id="email" name="email" type="text" className="form-control" defaultValue={data.email || ''} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group row">
            <label htmlFor="txtEmailAddressBilling" className="col-lg-3 col-form-label">Website URL</label>
            <div className="col-lg-9">
              <input id="url" name="url" type="text" className="form-control" defaultValue={data.url || ''} />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="form-group row">
            <label htmlFor="txtAddress1Billing" className="col-lg-3 col-form-label">Address</label>
            <div className="col-lg-9">
              <textarea id="address" name="address" rows="4" className="form-control" defaultValue={data.phone || ''}></textarea>
            </div>
          </div>
        </div>
      </div>
    </fieldset>
  </div>
)