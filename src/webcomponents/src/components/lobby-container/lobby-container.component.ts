import { UserService } from './../../services/user.service';
import { JwtService } from '../../services/jwt.service';
import { JwtPayload } from '../../models/jwtPayload';
import { LoginUserDto } from '../../models/loginUserDto';
import { css, customElement, html, LitElement, query, property, unsafeCSS } from 'lit-element';
import './sign-up/sign-up.component.ts';
import './sign-in/sign-in.component.ts';

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
	userService = new UserService('https://marius96.uber.space/');
	jwtService = new JwtService();

	@property()
	activeTab: 'signIn' | 'signUp' = 'signIn';

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

	@property()
	loggedUser: JwtPayload;

	async firstUpdated() {
		await this.loadUserData();
	}

	async loadUserData() {
		try {
			this.loggedUser = await this.jwtService.getJwtPayload();
			if (!this.loggedUser) this.logout();
		} catch (error) {
			this.logout();
		}
	}

	async loggedIn() {
		this.formSuccess = true;
		setTimeout(async () => {
			this.loggedUser = await this.jwtService.getJwtPayload();
			this.emitLogin();
		}, 500);

	}

	emitLogin() {
		this.dispatchEvent(new CustomEvent('loggedIn', {
			bubbles: true,
		}));
	}

	async logout() {
		this.loggedUser = undefined;
		this.formSuccess = false;
		await this.userService.logout();
	}


	render() {
		return html`
		<bubbles-animation>
			<div class="container ${this.formSuccess ? 'form-success' : ''}">
			<div class="tabs">
			<button @click=${() => this.activeTab = 'signIn'} class="${this.activeTab === 'signIn' ? 'active' : ''}">Sign in</button>
			<button @click=${() => this.activeTab = 'signUp'} class="${this.activeTab === 'signUp' ? 'active' : ''}">Sign up</button>
			</div>
			<h1>Welcome</h1>
			${!this.formSuccess ? html`
			${this.activeTab === 'signIn' ? html`
					<!-- Sign in View -->
					<sign-in @loggedIn=${async () => await this.loggedIn()}></sign-in>
` : html`
<!-- Sign Up view -->
<sign-up @registered=${async () => await this.loggedIn()}></sign-up>

`}
				` : ''}
			</div>
		</bubbles-animation>
  `
	}
}