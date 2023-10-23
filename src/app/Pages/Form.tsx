'use client'
import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Checkbox, Container, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup } from '@mui/material'

interface PersonDetails {
  firstname: string
  lastname: string
  gender: string
  age: string
}

interface Details {
  address: string
  contactnumber: string
  email: string
}
interface HouseDetails {
  propertytype: string
  type: string
  price: string
}

interface FormData {
  person: PersonDetails
  details: Details
  housedetails: HouseDetails
}

const schema = yup.object().shape({
  person: yup.object().shape({
    firstname: yup.string().required('First Name is required'),
    lastname: yup.string().required('Last Name is required'),
    gender: yup.string().required('Gender is required'),
    age: yup.number().required('Age is required').positive('Age must be a positive number')
  }),
  details: yup.object().shape({
    address: yup.string().required('Address is required'),
    contactnumber: yup.string().max(10).min(6).required('contactnumber is required'),
    email: yup.string().email('Invalid email address').required('Email is required')
  }),
  housedetails: yup.object().shape({
    propertytype: yup.string().required('Property Type is required').oneOf(['House', 'Apartment'], 'Invalid Property Type'),
    type: yup.string().required('BHK Type is required'),
    price: yup.number().required('Price is required').positive('Price must be a positive number')
      .integer('Price must be an integer').min(0, 'Price must be at least 0')
  })

})

const Form = () => {
  const { handleSubmit, control, reset, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  const [formData, setFormData] = useState<FormData[]>([])
  const [jsonResult, setJsonResult] = useState<string | null>(null)

  const onSubmit = (data: any) => {
    const newFormData: FormData = {
      person: {
        firstname: data?.person?.firstname,
        lastname: data?.person?.lastname,
        gender: data?.details?.gender,
        age: data?.details?.age
      },
      details: {
        address: data?.details?.address,
        contactnumber: data?.details?.contactnumber,
        email: data?.details?.email
      },
      housedetails: {
        propertytype: data?.housedetails?.oneBHK,
        type: data?.housedetails?.twoBHK,
        price: data?.housedetails?.price
      }
    }

    setFormData([...formData, newFormData])

    reset({
      person: { firstname: '', lastname: '', gender: '', age: '' },
      details: { address: '', contactnumber: '', email: '' },
      housedetails: { propertytype: '', type: '', price: '' }
    })
  }

  const generateJsonResult = () => {
    const jsonResultObject = formData.map((form) => ({
      person: {
        firstname: form.person.firstname,
        lastname: form.person.lastname,
        gender: form.person.gender,
        age: form.person.age
      },
      details: {
        address: form.details.address,
        contactnumber: form.details.contactnumber,
        email: form.details.email
      },
      housedetails: {
        propertytype: form.housedetails.propertytype,
        type: form.housedetails.type,
        price: form.housedetails.price
      }
    }))

    setJsonResult(JSON.stringify(jsonResultObject))
    console.log('Table Data in JSON Format:', jsonResultObject)
  }

  useEffect(() => {
    generateJsonResult()
  }, [formData])

  return (
    <>
    <h1> Hosue Selling Form - </h1>
    <Container component="main" >
     <form onSubmit={handleSubmit(onSubmit)}>

      <label> First Name </label><br/><br/>
     <Controller control={control} name="person.firstname" render={({ field }) =>
      <TextField label="FirstName" {...field} />} />
      <p>{errors.person?.firstname?.message}</p>

      <label> Last Name </label><br/><br/>
      <Controller control={control} name="person.lastname" render={({ field }) =>
      <TextField label="LastName" {...field} />} />
      <p>{errors.person?.lastname?.message}</p>

      <label> Age </label><br/><br/>
      <Controller control={control} name="person.age" render={({ field }) =>
      <TextField label="Age" {...field} type="number" />} />
      <p>{errors.person?.age?.message}</p>

      <label> Gender </label><br/><br/>
      <Controller control={control} name="person.gender" render={({ field }) =>
        (
        <>
          <FormControl>
            <RadioGroup {...field}>
              <FormControlLabel value="Male" control={<Radio />} label="Male" />
              <FormControlLabel value="Female" control={<Radio />} label="Female" />
              <FormControlLabel value="Other" control={<Radio />} label="Other" />
            </RadioGroup>
          </FormControl>
        </>
        )}
/>
      <p>{errors.person?.gender?.message}</p>

      <label> Address </label><br/><br/>
      <Controller control={control} name="details.address" render={({ field }) =>
      <TextField label="Address" {...field} />}/>
      <p>{errors.details?.address?.message}</p>

      <label> Contact-Number </label><br/><br/>
      <Controller control={control} name="details.contactnumber" render={({ field }) =>
      <TextField label="ContactNumber" {...field} />}/>
      <p>{errors.details?.contactnumber?.message}</p>

      <label> Email</label><br/><br/>
      <Controller control={control} name="details.email" render={({ field }) =>
      <TextField label="Email" {...field} />}/>
      <p>{errors.details?.email?.message}</p>

      <label> Property-Type </label><br/><br/>
      <Controller control={control} name="housedetails.propertytype" render={({ field }) =>
      <TextField select {...field} SelectProps={{ native: true }} >
      <option value="">Select Property Type</option>
      <option value="House">House</option>
      <option value="Apartment">Apartment</option>
      </TextField> }/>
      <p>{errors.housedetails?.propertytype?.message}</p>

      <label> Type </label><br/><br/>
      <Controller control={control} name="housedetails.type" render={({ field }) =>
        (
        <>
    <FormControl>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox {...field} value="1BHK" />}
          label="1 BHK"
        />
        <FormControlLabel
          control={<Checkbox {...field} value="2BHK" />}
          label="2 BHK"
        />
      </FormGroup>
    </FormControl>
  </>
        )}/>
        <p>{errors.housedetails?.type?.message}</p>

        <label> Price</label><br/><br/>
      <Controller control={control} name="housedetails.price" render={({ field }) =>
      <TextField fullWidth type='number' {...field} />}/>
      <p>{errors.housedetails?.price?.message}</p>

     <Button type="submit" variant="contained">
      Submit
      </Button>

      </form>
      </Container>
      </>
  )
}

export default Form
