//! State transition types

use arrayref::{array_mut_ref, array_ref, array_refs, mut_array_refs};
use solana_program::{
    program_error::ProgramError,
    program_pack::{IsInitialized, Pack, Sealed},
    pubkey::Pubkey,
};
use std::str::from_utf8;

/// HelloWorld data.
#[repr(C)]
#[derive(Clone, Debug, Default, PartialEq)]
pub struct HelloWorldState {
    /// account
    pub account_key: Pubkey,
    /// message 
    pub message: String
}
impl Sealed for HelloWorldState {}
impl IsInitialized for HelloWorldState {
    fn is_initialized(&self) -> bool {
        return true;
    } 
}
impl Pack for HelloWorldState {
    const LEN: usize = 32+1+256; // max hello message's length is 256
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let src = array_ref![src, 0, 289];
        let (account_key_buf, message_len_buf, message_buf) = array_refs![src, 32, 1, 256];
        let account_key = Pubkey::new_from_array(*account_key_buf);
        let message_len = message_len_buf[0] as u8;
        let (msg_buf, _rest) = message_buf.split_at(message_len.into());
        let message = String::from(from_utf8(msg_buf).unwrap()) ;
        Ok(HelloWorldState {
            account_key,
            message
        })
    }
    fn pack_into_slice(&self, dst: &mut [u8]) {
        let dst = array_mut_ref![dst, 0, 289];
        let (
            account_key_buf,
            message_len_buf,
            message_buf,
        ) = mut_array_refs![dst, 32, 1, 256];
 
        account_key_buf.copy_from_slice(self.account_key.as_ref());
        message_len_buf[0] = self.message.len() as u8;
        message_buf.copy_from_slice(&self.message.as_bytes());
    }
}