import { FormInfo, ErrorMap, StripeCtx } from '@/declarations';

export const formatPhoneNumber = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length <= 3) {
    return cleaned;
  } else if (cleaned.length <= 6) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  } else {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6,
      10
    )}`;
  }
};

export const validateEmailFormat = (email: string) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

export function validateForm(formData: FormInfo) {
  const errors: ErrorMap = {};

  if (!validateEmailFormat(formData.email)) {
    errors.email = true;
  }

  if (formData.orgDonate && formData.orgName.trim() === '') {
    errors.orgName = true;
  }

  if (formData.address1.trim() === '') {
    errors.address1 = true;
  }

  if (formData.state.trim() === '') {
    errors.state = true;
  }

  if (formData.country.trim() === '') {
    errors.country = true;
  }

  if (formData.postalCode.trim() === '') {
    errors.postalCode = true;
  }

  if (formData.city.trim() === '') {
    errors.city = true;
  }

  if (formData.firstName.trim() === '') {
    errors.firstName = true;
  }

  if (formData.lastName.trim() === '') {
    errors.lastName = true;
  }

  return errors;
}

export async function handleSubmit({
  e,
  step,
  formData,
  stripeCtx,
  clientSecret,
  setShowErrors,
  nextStep,
  setLoading,
  setErrorMessage,
}: {
  e: React.FormEvent<HTMLFormElement>;
  step: number;
  formData: FormInfo;
  stripeCtx: StripeCtx;
  clientSecret: string;
  setShowErrors: React.Dispatch<React.SetStateAction<ErrorMap>>;
  nextStep: () => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  e.preventDefault();
  const { stripe, elements } = stripeCtx;
  if (step === 1) {
    const donationAmount = parseFloat(formData.amount || '0');
    if (
      isNaN(donationAmount) ||
      donationAmount < 1 ||
      donationAmount > 999999.99
    ) {
      return;
    }
  } else if (step === 2) {
    const errors = validateForm(formData);
    // Update state with all the errors
    setShowErrors(prev => ({
      ...prev,
      ...errors,
    }));

    // If there are any errors, prevent submission
    if (Object.keys(errors).length > 0) {
      return;
    }

    // No errors - clear previous errors
    setShowErrors({});
  } else if (step === 3) {
    setLoading(true);

    if (!stripe || !elements) {
      console.warn('Stripe not ready');
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `http://localhost:3000/payment-success?amount=${formData.amount}`,
        receipt_email: formData.email,
        payment_method_data: {
          billing_details: {
            address: {
              country: formData.country,
              line1: formData.address1,
              line2: formData.address2,
              state: formData.state,
              city: formData.city,
              postal_code: formData.postalCode,
            },
          },
        },
      },
    });

    if (error) {
      setErrorMessage(error.message || 'Payment failed');
    }

    setLoading(false);
  }
  nextStep();
}
