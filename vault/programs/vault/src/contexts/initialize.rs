use anchor_lang::prelude::*;

use crate::states::VaultState;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)] // since we are changing the state
    pub user: Signer<'info>,
    #[account(
        init,
        payer = user,
        space = 8+VaultState::INIT_SPACE,
        seeds = [b"state", user.key().as_ref()],
        bump
    )]
    pub state: Account<'info, VaultState>,
    #[account(
        seeds = [b"vault", state.key().as_ref()],
        bump
    )]
    pub vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl <'info> Initialize<'info> {
    pub fn initialize(&mut self, bumps: &InitializeBumps) -> Result<()>{
        self.state.vault_bump = bumps.vault;
        self.state.state_bump = bumps.state;
        Ok(())
    }
}