import React from 'react'

import { FieldValues, useController, UseControllerProps } from 'react-hook-form'

import { TextField, TextFieldProps } from '@mui/material'

function InputText<T extends FieldValues>({
  name,
  control,
  ...props
}: UseControllerProps) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control, rules: { required: true } })
  return <TextField value={value} onChange={onChange} {...props} />
}

export default InputText
