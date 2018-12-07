import React from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.css'

export default ({ data }) => (
  <div>
  <fieldset className="body current" role="tabpanel">
    <div className="row">
      <div className="col-md-6">
        <div className="form-group row">
          <label htmlFor="accountNumber" className="col-lg-3 col-form-label">Account Number</label>
          <div className="col-lg-9">
            <input id="accountNumber" name="accountNumber" type="text" className="form-control" defaultValue={data.accountNumber || ''} />
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="form-group row">
          <label htmlFor="bvn" className="col-lg-3 col-form-label">BVN</label>
          <div className="col-lg-9">
            <input id="bvn" name="bvn" type="text" className="form-control" defaultValue={data.bvn || ''} />
          </div>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-md-6">
        <div className="form-group row">
          <label htmlFor="bankCode" className="col-lg-3 col-form-label">Bank Name</label>
          <div className="col-lg-9">
            <Select id="bankCode" name="bankCode" value="044"
              options={[
                { value: '', label: '--Please Select--' },
                { value: '044', label: 'Access Bank' },
                { value: '011', label: 'First Bank' },
                { value: '058', label: 'GTBank' },
                { value: '057', label: 'Zenith Bank' }
              ]}
            />
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="form-group row">
          <label htmlFor="accountName" className="col-lg-3 col-form-label">Account Name</label>
          <div className="col-lg-9">
            <input id="accountName" name="accountName" type="text" className="form-control" defaultValue={data.accountName || ''} />
          </div>
        </div>
      </div>
    </div>
  </fieldset>
  </div>
)