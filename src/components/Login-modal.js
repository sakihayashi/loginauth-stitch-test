import React from 'react'
import ReactDOM from 'react-dom'
import './login-modal.css'
import LogInSignUpForm from './LogInSignUp'

class LoginModal extends React.Component {
    state = {
        email: '',
        picture: {},
        name: '',
        accessToken: '',
        isOpen: false
    }

    onOpen = () => {
        this.setState({ isOpen: true });
    }
    onClose = () => {
        this.setState({isOpen: false})
    }
    
    render() {
      const { triggerText } = this.props
      const { isOpen } = this.state
      const ModalTrigger = ({text, onOpen }) => <button onClick={onOpen} className="modal-btn">{text}</button>;
      const ModalContent = ({onClose}) => {
        return ReactDOM.createPortal(
            <aside className="c-modal-cover">
              <div className="c-modal">
                <LogInSignUpForm />
                <div className="c-modal__body">
                  
                  <button className="c-modal__close" aria-label="Close Modal" onClick={onClose}>
                  <span className="u-hide-visually">Close</span>
                  <svg className="c-modal__close-icon" viewBox="0 0 40 40"><path d="M 10,10 L 30,30 M 30,10 L 10,30"></path></svg>
                </button>
                </div>
              </div>
            </aside>,
            document.body
          );
      }

      return (
          <React.Fragment>
            <ModalTrigger 
            text={triggerText}
            onOpen={this.onOpen}
             />
            { isOpen &&
            <ModalContent onClose={this.onClose}/>
             }
            
          </React.Fragment>
      );
    }
  }
  

  export default LoginModal;