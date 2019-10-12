import { LoginUserDto } from './../../models/loginUserDto';
import { css, customElement, html, LitElement, query, property, unsafeCSS } from 'lit-element';
import { UserService } from '../../services/user.service';

const componentCSS = require('./lobby-container.component.scss');

/**
 *
 * This component is the sign-in component.
 *
 * It allows the user to login.
 *
 * @export
 * @class LobbyContainer
 * @extends {LitElement}
 */

@customElement('lobby-container')
class LobbyContainer extends LitElement {
	static styles = css`${unsafeCSS(componentCSS)}`;

	@property()
	url = 'http://localhost:3000';

	userService!: UserService;

	@property()
	formSuccess = false;

	@property()
	loading = false;

	@query('form')
	form!: HTMLFormElement;

	@query('#email')
	emailElement!: HTMLInputElement;

	@query('#password')
	passwordElement!: HTMLInputElement;

	firstUpdated() {
		this.userService = new UserService(this.url);
		console.log("LobbyContainer");
		console.log(this.url);
	}

	async submit(e?: MouseEvent) {
		e ? e.preventDefault() : '';
		let jwtToken = '';
		if (this.isFormValid()) {
			const signInData: LoginUserDto = {
				email: this.emailElement.value,
				password: this.passwordElement.value
			};
			try {
				this.loading = true;
				jwtToken = await this.userService.login(signInData);
			} catch (error) {
				//
			}
			jwtToken ? this.formSuccess = true : '';
			this.loading = false;
		} else {
			this.form.classList.add('was-validated');
		}
		if (jwtToken) {
			setTimeout(() => this.emitLogin(jwtToken), 1000);
		}
	}

	emitLogin(jwtToken: string) {
		this.dispatchEvent(
			new CustomEvent('login', {
				detail: jwtToken,
				bubbles: true
			})
		);
	}

	isFormValid() {
		return this.form.checkValidity();
	}

	render() {
		return html`
	<div class="container ${this.formSuccess ? 'form-success' : ''}">
		<h1>Welcome</h1>
		${!this.formSuccess ? html`
		<form class="form">
			<input type="email" required id="email" name="email" placeholder="Email">
			<input type="password" required id="password" name="password" placeholder="Password">
			<button
			id="login-button" @click=${(e: MouseEvent) => this.submit(e)}
			class="${this.loading ? 'loading' :

					''}"
			>${this.loading ? '...' : 'Login'}</button>
		</form>
		` : ''}
	</div>
  `
	}
}