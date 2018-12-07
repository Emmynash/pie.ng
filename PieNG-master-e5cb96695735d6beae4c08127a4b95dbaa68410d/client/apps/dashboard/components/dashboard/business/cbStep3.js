import React from 'react'

export default () => (
  <div>
    <fieldset className="body current" role="tabpanel">
      <div className="p-3">
        <label className="custom-control custom-checkbox">
          <input type="checkbox" className="custom-control-input" />
          <span className="custom-control-indicator"></span>
          <span className="custom-control-description">I agree with the Terms and Conditions.</span>
        </label>
      </div>
    </fieldset>
  </div>
)