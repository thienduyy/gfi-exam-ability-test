import LogoTinder from "../../assets/svgs/Logo";
import "../../scss/ModalLogin.scss";
import { Button, Checkbox, Col, Form, Input, message, Row } from "antd";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const SignIn = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { dispatch } = useContext(AuthContext);

  const onFinish = (values) => {
    const { username: email, password } = values;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        if (userCredential) {
          const user = userCredential.user;
          dispatch({ type: "LOGIN", payload: user });
          navigate("/app");
        }
      })
      .catch((err) => {
        message.open({
          type: "error",
          content: "Login Fail!",
        });
      });
  };
  const onFinishFailed = (errorInfo) => {
    message.open({
      type: "error",
      content: "Login Fail!",
    });
  };

  // validate new password

  const passwordValidator = (_, value) => {
    if (!value || value.length <= 8) {
      return Promise.reject("Must more than 8 character!");
    }
    return Promise.resolve();
  };

  return (
    <Row>
      <Col span={24} className="signin__header">
        <LogoTinder />
        <h2 className="signin__header--title mt-8">Start</h2>
      </Col>
      <Form
        form={form}
        layout="vertical"
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="w-100"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Col>
            <h3 className="signin__form--label">Email</h3>
            <Input className="input signin__input--black" />
          </Col>
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
            {
              validator: passwordValidator,
            },
          ]}
        >
          <Col>
            <h3 className="signin__form--label">Password</h3>

            <Input.Password className="input signin__input--black" />
          </Col>
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 9, span: 15 }}
        >
          <Checkbox className="signin__checkbox">Remember me</Checkbox>
        </Form.Item>

        <Col className="f-center">
          <Button
            className="btn btn__tinderColor"
            shape="round"
            type="primary"
            htmlType="submit"
          >
            Submit
          </Button>
        </Col>
      </Form>
    </Row>
  );
};

export default SignIn;
