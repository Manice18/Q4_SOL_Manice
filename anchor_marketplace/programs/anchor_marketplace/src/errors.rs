use anchor_lang::prelude::*;

#[error_code]
pub enum MarketplaceError {
    #[msg("The length for the given name for the markerplace should be less than 32")]
    NameTooLong,
}
