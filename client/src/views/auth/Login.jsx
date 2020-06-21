import React from 'react';
import LoginImage from '../../assets/images/pages/login.png';
import { Link, withRouter } from 'react-router-dom';
import { setCookie, getCookie } from '../../utils/app-utils';
import { updateAuthUserData } from '../../actions/auth-action';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { Formik } from 'formik';
import {
    AppInput,
    AppInputPassword,
    AppCheck,
    AppSubmitBtn,
} from '../../shared/formikBootstrap/Fields';
import * as Yup from 'yup';
import { request } from '../../utils/axios-utils';

export class LoginComponent extends React.PureComponent {
    componentDidMount() {
        if (getCookie('ACCESS-TOKEN')) {
            this.props.history.push('/admin');
        }
    }
    handleSubmit = (values, { setSubmitting, setErrors }) => {
        request
            .post('login', values)
            .then(
                ({
                    data: {
                        data: { token, user },
                    },
                }) => {
                    setCookie('ACCESS-TOKEN', token, 365);
                    setSubmitting(false);
                    this.props.dispatch(updateAuthUserData(user));
                    this.props.history.push('/admin');
                },
            )
            .catch((error) => {
                setSubmitting(false);
                if (error.response.status === 422) {
                    setErrors(error.response.data.errors);
                }
            });
    };
    render() {
        return (
            <div className="row m-0">
                <div className="col-md-6 col-12 px-0">
                    <div className="card disable-rounded-right mb-0 p-2 h-100 d-flex justify-content-center">
                        <div className="card-header">
                            <div className="card-title">
                                <h4 className="text-center mb-2">Login</h4>
                            </div>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <LoginForm handleSubmit={this.handleSubmit} />
                                <hr />
                                <div className="text-center">
                                    <small className="mr-25">Don&rsquo;t have an account?</small>
                                    <Link to="/auth/signup" className="card-link">
                                        <small>Sign up</small>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 d-md-block d-none text-center align-self-center p-3">
                    <div className="card-content">
                        <img className="img-fluid" src={LoginImage} alt="branding logo" />
                    </div>
                </div>
            </div>
        );
    }
}
const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Required'),
    password: Yup.string().min(8).max(12).required(),
});

export const LoginForm = ({ handleSubmit }) => {
    return (
        <Formik onSubmit={handleSubmit} validationSchema={LoginSchema} initialValues={{}}>
            {(props) => (
                <form onSubmit={props.handleSubmit}>
                    <AppInput name="email" placeholder="Email Address" label="Email Adddress" />
                    <AppInputPassword label="Password" placeholder="Password" name="password" />
                    <div className="form-group d-flex flex-md-row flex-column justify-content-between align-items-center">
                        <AppCheck type="switch" label="Keep me logged in" name="keepMe" />
                    </div>
                    <AppSubmitBtn className="w-100">
                        Login
                        <i id="icon-arrow" className="bx bx-right-arrow-alt"></i>
                    </AppSubmitBtn>
                </form>
            )}
        </Formik>
    );
};

export const LoginPage = connect((state) => {
    //  console.log('state', state)
    return {
        userId: get(state, 'auth.user.id', null),
    };
})(withRouter(LoginComponent));
