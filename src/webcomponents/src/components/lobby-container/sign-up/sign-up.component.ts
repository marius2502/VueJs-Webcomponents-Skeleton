import { LoginUserDto } from './../../../models/loginUserDto';
import { JwtPayload } from '../../../models/jwtPayload';
import { css, customElement, html, LitElement, query, property, unsafeCSS } from 'lit-element';
import { navigateExternal } from '../../../helper/router';
import { UserService } from '../../../services/user.service';

const componentCSS = require('./sign-up.component.scss');

@customElement('sign-up')
class SignInComponent extends LitElement {
	static styles = css`${unsafeCSS(componentCSS)}`;
	userService = new UserService('https://marius96.uber.space');

	@property()
	formSuccess = false;

	@property()
	loading = false;

	@property()
	formIsValid = false;

	@query('form')
	form!: HTMLFormElement;

	@property()
	errorMsg = '';

	@query('#email')
	emailElement!: HTMLInputElement;

	@query('#password')
	passwordElement!: HTMLInputElement;

	@query('#password2')
	passwordElement2!: HTMLInputElement;

	async submit(e?: MouseEvent) {
		e.stopImmediatePropagation();
		e ? e.preventDefault() : '';
		let jwtToken = '';
		if (this.isFormValid()) {
			const signInData: LoginUserDto = {
				email: this.emailElement.value,
				password: this.passwordElement.value
			};
			try {
				this.loading = true;
				jwtToken = await this.userService.register(signInData);
			} catch (error) {
				this.errorMsg = error.error;
			}
			jwtToken ? this.emitLogin() : '';
			this.loading = false;
		} else {
			this.form.classList.add('was-validated');
		}
	}

	emitLogin() {
		this.dispatchEvent(new CustomEvent('registered', {
			bubbles: true,
		}));
	}

	isFormValid() {
		if (
			(this.passwordElement.value && this.passwordElement2.value) &&
			(this.passwordElement.value !== this.passwordElement2.value)
		) {
			this.form.classList.add('was-validated');
			this.passwordElement2.setCustomValidity('Passwords must match');
		} else {
			this.passwordElement2.setCustomValidity('');
		}
		const isValid = this.form.checkValidity();
		this.formIsValid = isValid;
		return isValid;
	}

	render() {
		return html`
					<form class="form">
						<input
						@keyup=${() => this.isFormValid()}
						@keydown=${() => this.isFormValid()}
						@change=${() => this.isFormValid()}
						type="email" required id="email" name="email" placeholder="Email">
						<input
						@keyup=${() => this.isFormValid()}
						@keydown=${() => this.isFormValid()}
						@change=${() => this.isFormValid()}
						type="password" required id="password" name="password" placeholder="Password">
						<div>
							<input
							@keyup=${() => this.isFormValid()}
							@keydown=${() => this.isFormValid()}
							@change=${() => this.isFormValid()}
							 type="password" required id="password2" name="password2" placeholder="Repeat Password">
        		</div>

						${this.errorMsg ? html`
						<div class="error-message">${this.errorMsg}</div>
						` : ''}

						<div class="privacy-confirmation">
							<div>
								<input
								@change=${() => this.isFormValid()}
								required
								type="checkbox" id="privacy-checkbox" name="privacy-checkbox">
								<label for="privacy-checkbox">I hereby confirm that I have read and agree with the <a target="_blank" href="https://MariusBongarts.github.io/datenschutzerklaerung/">privacy policy</a>.</label>

							</div>
						</div>

						<button
						?disabled=${!this.formIsValid}
						type="submit" id="login-button" @click=${(e: MouseEvent) => this.submit(e)}
						class="${this.loading ? 'loading' :

				''}"
				>${this.loading ? '...' : 'Sign up'}</button>
				</form>

`
	}

}