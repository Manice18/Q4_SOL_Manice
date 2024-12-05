use anchor_lang::prelude::*;

use crate::constants::*;

#[account]
pub struct Config {
    pub mint_x: Pubkey,
    pub mint_y: Pubkey,
    pub authority: Pubkey,
    pub seed: u64,
    pub fee: u16,
    pub locked: bool,
    pub auth_bump: u8,
    pub config_bump: u8,
}

impl Config {
    pub const LEN: usize = 8 + PUBKEY_L * 3 + U64_L + U16_L + BOOL_L + U8_L * 2;
}
