import * as Yup from 'yup';

export const validationSchema = Yup.object({
  name: Yup.string().trim().required('Please enter Name'),
  email: Yup.string()
    .trim()
    .email('Please enter valid email address')
    .required('Please enter Email'),
  number: Yup.string()
    .trim()
    .matches(/^[6-9]{1}[0-9]{9}$/, 'Invalid number')
    .required('Please enter a valid Mobile Number'),
  city: Yup.string().trim().required('City Name cannot be empty').nullable(),
  state: Yup.string().trim().required('State Name cannot be empty').nullable(),
  areaCode: Yup.string()
    .trim()
    .matches(/^[1-9]{1}[0-9]{5}$/, 'Invalid pin Code')
    .required('Please enter a valid Pin Code'),
  street: Yup.string().trim().required('Please enter street'),
  building: Yup.string().trim().required('Please enter building'),
  tag: Yup.string().trim().required('Please select tag'),
});

export const addressTags: string[] = ['Home', 'Office', 'Other'];
