import * as Yup from 'yup';

export const billingAddressValidationSchema = Yup.object({
  name: Yup.string().trim().required('Please enter Name'),
  email: Yup.string()
    .trim()
    .email('Please enter a valid email address')
    .required('Please enter Email'),
  number: Yup.string()
    .trim()
    .matches(/^[6-9]{1}[0-9]{9}$/, 'Please enter a valid Mobile Number')
    .required('Please enter Mobile Number'),
  city: Yup.string().trim().required('City Name cannot be empty'),
  state: Yup.string().trim().required('State Name cannot be empty'),
  pin: Yup.string()
    .trim()
    .matches(/^[1-9]{1}[0-9]{5}$/, 'Please enter a valid Pin Code')
    .required('Please enter Pin Code'),
  street: Yup.string().trim().required('Please enter Full Address'),
});
