import { FormInfo, ErrorMap } from '../donationForm';
import { validateEmailFormat } from '@/lib/functions';

interface StepProps {
  formData: FormInfo;
  setFormData: React.Dispatch<React.SetStateAction<FormInfo>>;
  showErrors: ErrorMap;
  setShowErrors: React.Dispatch<React.SetStateAction<ErrorMap>>;
}

export default function Email({
  formData,
  setFormData,
  showErrors,
  setShowErrors,
}: StepProps) {
  return (
    <div className="input-container">
      <label className="input-sub-container">
        {formData.orgDonate ? (
          <p>
            Contact Email <span className="required">*</span>
          </p>
        ) : (
          <p>
            Email <span className="required">*</span>
          </p>
        )}
        <div className="flex flex-col w-full">
          <input
            type="text"
            value={formData.email}
            onChange={e => {
              setFormData(prev => ({
                ...prev,
                email: e.target.value,
              }));
              setShowErrors(prev => ({
                ...prev,
                email: false,
              }));
            }}
            className={`input-field ${
              showErrors.email && !validateEmailFormat(formData.email)
                ? 'show-invalid'
                : ''
            }`}
          />
          <div
            className={`error-text-container ${
              showErrors.email && !validateEmailFormat(formData.email)
                ? 'transition'
                : ''
            }`}
          >
            {formData.email ? (
              <p className="error-text">
                Please enter in the format: email@domain.com
              </p>
            ) : (
              <p className="error-text">Email is required</p>
            )}
          </div>
        </div>
      </label>
    </div>
  );
}
