import * as Yup from 'yup';
import { useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import useLocales from '../../../hooks/useLocales';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const { register } = useAuth();
  const { translate } = useLocales();

  const isMountedRef = useIsMountedRef();

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required('Xin vui lòng nhập tên !'),
    email: Yup.string().email('Xin vui lòng nhập tài email').required('Xin vui lòng nhập tài email'),
    username: Yup.string().required('Xin vui lòng nhập tài khoản !'),
    password: Yup.string().required('Xin vui lòng nhập mật khẩu !'),
  });

  const defaultValues = {
    name: '',
    username: '',
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await register(data.name, data.username, data.email, data.password,);
    } catch (error) {
      console.error(error);
      reset();
      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.message });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}> */}
        <RHFTextField name="name" label={translate("media.user.name")} />

        {/* </Stack> */}
        <RHFTextField name="username" label={translate("media.user.username")} />
        <RHFTextField name="email" label={translate("media.user.email")} />

        <RHFTextField
          name="password"
          label={translate("media.user.password")}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Đăng Kí
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
