import React, { Fragment } from 'react'
import Helmet from 'react-helmet'
import Recaptcha from 'react-google-recaptcha'

import {
    Stitch,
    UserPasswordAuthProviderClient,
    UserPasswordCredential    
  } from "mongodb-stitch-browser-sdk";

import './Form.css'

const RECAPTCHA_KEY = '6LdDK64UAAAAADtq1Mt1f-cuX3pdaeysEbFYt-7_';
const client = Stitch.initializeDefaultAppClient('test007-lltnz');
const emailPassClient = client.auth
    .getProviderClient(UserPasswordAuthProviderClient.factory, "userpass");

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

  handleInput = (event) => {
    this.setState({
        [event.target.name]: event.target.value
    })
  }

// Register a new application user when the user submits their information
  async handleSignup() {
  
    try {
    
      await emailPassClient.registerWithEmail(this.state.email, this.state.password)
      this.setState({
        successMessage: '確認のメールを送りました。メールボックスをご確認の上、リンクをクリックして、登録完了です。'
      })

    } catch(e) {
      console.log('error message: ', e);
      
      this.setState({
        errorMessage: 'ユーザーは登録済みです。ログインして下さい。'
      })
      // handleError(e)
    }
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