import React, {useEffect, useMemo} from 'react';
import PrivateScreen from 'contexts/AuthScreen';
import {getCustomerByToken} from 'store/slices/authSlice';
import {useAppDispatch, useAppSelector} from 'hooks';

export default function AuthWrapper(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const dispatch = useAppDispatch();
    const customerData = useAppSelector(state => state.auth.customerData);

    // useEffect(() => {
    //   if (!customerData?.id) {
    //     dispatch(getCustomerByToken());
    //   }
    // }, [customerData?.id, dispatch]);

    const MemoizedComponent = useMemo(() => {
      return <WrappedComponent {...props} />;
    }, [props]);

    if (!customerData?.id) {
      return <PrivateScreen />;
    }

    return MemoizedComponent;
  };
}
