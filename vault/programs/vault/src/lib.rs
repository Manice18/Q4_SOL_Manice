use anchor_lang::prelude::*;

pub mod contexts;
pub use contexts::*;

pub mod states;

declare_id!("5QGva3USGhawe1ieA8btA677GNrWDpUCzAMmP3hkWpXJ");

#[program]
pub mod vault {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.initialize(&ctx.bumps)
    }

    pub fn deposit(ctx: Context<Payment>, amount: u64) -> Result<()> {
        ctx.accounts.depost(amount)
    }

    pub fn withdraw(ctx: Context<Payment>, amount: u64) -> Result<()> {
        ctx.accounts.withdraw(amount)
    }
}
