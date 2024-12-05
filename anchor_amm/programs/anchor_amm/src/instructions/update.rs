use crate::errors::AmmError;
use crate::has_update_authority;
use crate::states::config::Config;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(address: Pubkey)]
pub struct Update<'info> {
    #[account(mut, address = address)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        seeds = [b"config", config.seed.to_le_bytes().as_ref()],
        bump = config.config_bump,
    )]
    pub config: Account<'info, Config>,
}

impl<'info> Update<'info> {
    pub fn lock(&mut self) -> Result<()> {
        // has_update_authority!(self);
        self.config.locked = true;
        Ok(())
    }
    pub fn unlock(&mut self) -> Result<()> {
        // has_update_authority!(self);
        self.config.locked = false;
        Ok(())
    }
}
