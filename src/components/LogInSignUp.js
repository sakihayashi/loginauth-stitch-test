import React, { Fragment } from 'react'
import Helmet from 'react-helmet'
import { stringify } from 'qs'
import { serialize } from 'dom-form-serializer'
import Recaptcha from 'react-google-recaptcha'

import {
    Stitch,
    AnonymousCredential,
    RemoteMongoClient,
    UserPasswordAuthProviderClient
  } from "mongodb-stitch-browser-sdk";

import './Form.css'

const RECAPTCHA_KEY = '6LdDK64UAAAAADtq1Mt1f-cuX3pdaeysEbFYt-7_';

function encode(data) {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

class LogInSignUpForm extends React.Component {
  static defaultProps = {
    name: 'forumUser',
    subject: '', // optional subject of the notification email
    action: '',
    successMessage: 'メッセージが送信されました。お問い合わせいただきありがとうございます。',
    errorMessage:
      '何らかのトラブルによりメッセージが送信できませんでした。記述事項を確認の上、もう一度送信してください。'
  }

  state = {
    alert: '',
    disabled: false,
    email: '',
    password: ''
  }

  handleRecaptcha = value => {
    this.setState({ "g-recaptcha-response": value });
  };

//   componentDidMount = () => {
  
//     //this client means belongs to the local class but not a state
//     //get the data from the data base
//     this.client = Stitch.initializeDefaultAppClient("userauthtest-cricc");

//     const mongodb = this.client.getServiceClient(
//       //connect to atlas
//       RemoteMongoClient.factory,
//       "mongodb-atlas"
//     );

//     //class varieble as DB name forum post
//     this.db = mongodb.db("forum");

//     this.displayTodosOnLoad();

//     this.setState({ currentPath: this.props.location.pathname })
//   }

  handleInput = (event) => {
    this.setState({
        [event.target.name]: event.target.value
    })
  }

  handleSignUp = e => {
      e.preventDefault()

    //   const userSignUpForm = e.target
    //   const userData = serialize(userSignUpForm)
    //   console.log('userData: ', userData)
    //   console.log('userData.email: ', userData.email)

      this.client = Stitch.initializeDefaultAppClient("userauthtest-cricc")

      const mongodb = this.client.getServiceClient(
      //connect to atlas
      RemoteMongoClient.factory,
      "mongodb-atlas"
      );
      this.db = mongodb.db("forum");

      const emailPassClient = Stitch.defaultAppClient.auth
        .getProviderClient(UserPasswordAuthProviderClient.factory);

        emailPassClient.registerWithEmail(this.state.email, this.state.password)
        .then(() => {
            console.log("Successfully sent account confirmation email!");
        })
        .catch(err => {
            console.log("Error registering new user:", err);
        });
  }

  handleSubmit = e => {
    e.preventDefault()
    if (this.state.disabled) return

    const form = e.target
    const data = serialize(form)
    console.log('form: ', form);
    
    console.log('data: ', data);
    
    this.setState({ disabled: true })
    fetch(form.action + '?' + stringify(data), {
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({
        "form-name": form.getAttribute("name"),
        ...this.state
      })
    })
      .then(res => {
        console.log('what is in res: ', res);
        
        if (res.ok) {
          return res
        } else {
          throw new Error('Network error')
        }
      })
      .then(() => {
        form.reset()
        this.setState({
          alert: this.props.successMessage,
          disabled: false
        })
      })
      .catch(err => {
        console.error(err)
        this.setState({
          disabled: false,
          alert: this.props.errorMessage
        })
      })
  }

  render() {
    const { name} = this.props

    return (
      <Fragment>
        <Helmet>
        <script src="https://www.google.com/recaptcha/api.js?render=6LfhA64UAAAAAL8SMCsSPDD1Pw6lI_8avu2IBs9y"></script>

        </Helmet>
        <form
          className="Form"
          name={name}
          method="post"
          onSubmit={this.handleSignUp}
        >
          <input type="hidden" name="form-name" value={name} />
          {this.state.alert && (
            <div className="Form--Alert">{this.state.alert}</div>
          )}
          <input type="hidden" name="bot-field" />
          <div className="Form--Group">
            <label className="Form--Label">
              <input
                className="Form--Input Form--InputText"
                type="text"
                placeholder="Eメールアドレス"
                name="email"
                required
                onChange={this.handleInput}
              />
              <span>Eメールアドレス</span>
            </label>
            <label className="Form--Label">
              <input
                className="Form--Input Form--InputText"
                type="password"
                placeholder="パスワード"
                name="password"
                onChange={this.handleInput}
                required
              />
              <span>パスワード</span>
            </label>
          </div>

          <label className="Form--Label Form-Checkbox">
            <input
              className="Form--Input Form--Textarea Form--CheckboxInput"
              name="newsletter"
              type="checkbox"
            />
            <span>ニュースレターを受け取る</span>
          </label>
          <Recaptcha
            ref="recaptcha"
            sitekey={RECAPTCHA_KEY}
            onChange={this.handleRecaptcha}
          />
          <input
            className="Button Form--SubmitButton"
            type="submit"
            value="サインアップ"
            disabled={this.state.disabled}
          />
        </form>
      </Fragment>
    )
  }
}

export default LogInSignUpForm