import { AccountsPage } from './app.po';

describe('accounts App', () => {
  let page: AccountsPage;

  beforeEach(() => {
    page = new AccountsPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
