use anchor_lang::{prelude::*, system_program::{Transfer, transfer}};

use crate::states::VaultState;

#[derive(Accounts)]
pub struct Payment<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(seeds = [b"state".as_ref(), user.key().as_ref()], bump = state.state_bump)]
    pub state: Account<'info, VaultState>,
    #[account(mut, seeds = [b"vault".as_ref(), state.key().as_ref()], bump = state.vault_bump)]
    pub vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

impl <'info> Payment<'info>{
    pub fn depost(&mut self, amount: u64) -> Result<()>{
        let cpi_program = self.system_program.to_account_info();
        let cpi_accounts = Transfer {
            from: self.user.to_account_info(),
            to: self.vault.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        transfer(cpi_ctx, amount)
    }

    pub fn withdraw(&mut self, amount: u64) -> Result<()>{
       let binding = self.state.to_account_info
       ().key();
       let seeds = &[b"vault".as_ref(), binding.as_ref(), &[self.state.vault_bump]];

       let transfer_accounts = Transfer {
        from: self.vault.to_account_info(),
        to: self.user.to_account_info()
        };

       let signer_seeds = &[&seeds[..]];

       let transfer_ctx = CpiContext::new_with_signer(self.system_program.to_account_info(), transfer_accounts, signer_seeds);

        transfer(transfer_ctx, amount)
    }
}