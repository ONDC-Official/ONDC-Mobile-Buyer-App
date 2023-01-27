import * as Yup from 'yup';

export const validationSchema = Yup.object({
  name: Yup.string().trim().required('This field is required'),
  email: Yup.string()
    .trim()
    .email('Please enter valid email address')
    .required('This field is required'),
  number: Yup.string()
    .trim()
    .matches(/^[6-9]{1}[0-9]{9}$/, 'Invalid number')
    .required('This field is required'),
  city: Yup.string().trim().required('This field is required'),
  state: Yup.string().trim().required('This field is required'),
  pin: Yup.string()
    .trim()
    .matches(/^[1-9]{1}[0-9]{5}$/, 'Invalid pin code')
    .required('This field is required'),
  landMark: Yup.string().trim().required('This field is required'),
  street: Yup.string().trim().required('This field is required'),
  tag: Yup.string().trim().required('This field is required'),
});

export const addressTags = ['Home', 'Office', 'Other'];
