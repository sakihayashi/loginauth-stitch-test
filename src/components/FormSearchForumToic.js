import React, { Fragment } from 'react'
import Helmet from 'react-helmet'
import { stringify } from 'qs'
import { serialize } from 'dom-form-serializer'
import Recaptcha from 'react-google-recaptcha'

import './Form.css'

const RECAPTCHA_KEY = '6LdDK64UAAAAADtq1Mt1f-cuX3pdaeysEbFYt-7_';

function encode(data) {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

class Form extends React.Component {
  static defaultProps = {
    name: 'newHamster',
    subject: '', // optional subject of the notification email
    action: '',
    successMessage: 'メッセージが送信されました。お問い合わせいただきありがとうございます。',
    errorMessage:
      '何らかのトラブルによりメッセージが送信できませんでした。記述事項を確認の上、もう一度送信してください。'
  }

  state = {
    alert: '',
    disabled: false
  }

  handleRecaptcha = value => {
    this.setState({ "g-recaptcha-response": value });
  };

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
          onSubmit={this.handleSubmit}
          netlify-honeypot="bot-field"
          data-netlify="true"
          data-netlify-recaptcha="true"
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
                placeholder="氏名"
                name="lastname"
                required
              />
              <span>氏名</span>
            </label>
            <label className="Form--Label">
              <input
                className="Form--Input Form--InputText"
                type="text"
                placeholder="名前"
                name="firstname"
                required
              />
              <span>名前</span>
            </label>
          </div>
          
          <label className="Form--Label">
            <input
              className="Form--Input Form--InputText"
              type="email"
              placeholder="Email"
              name="emailAddress"
              required
            />
            <span>Eメールアドレス</span>
          </label>
          <label className="Form--Label">
            <textarea
              className="Form--Input Form--Textarea Form--InputText"
              placeholder="質問のタイトルを記入"
              name="titleForum"
              rows="10"
              required
            />
            <span>タイトル</span>
          </label>
          <label className="Form--Label">
            <textarea
              className="Form--Input Form--Textarea Form--InputText"
              placeholder="質問内容"
              name="question"
              rows="1"
              required
            />
            <span>質問内容</span>
          </label>
          <label className="Form--Label Form-Checkbox">
            <input
              className="Form--Input Form--Textarea Form--CheckboxInput"
              name="receiveUpdate"
              type="checkbox"
            />
            <span>返信があったらメールを受け取る</span>
          </label>
          <Recaptcha
            ref="recaptcha"
            sitekey={RECAPTCHA_KEY}
            onChange={this.handleRecaptcha}
          />
          <input
            className="Button Form--SubmitButton"
            type="submit"
            value="送信"
            disabled={this.state.disabled}
          />
        </form>
      </Fragment>
    )
  }
}

export default Form