//! Program state processor

use crate::{
    instruction::{HelloWorldInstruction},
    state::{HelloWorldState},
};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    program_error::ProgramError,
    entrypoint::ProgramResult,
    msg,
    program_pack::{Pack},
    pubkey::Pubkey,
};

/// Program state handler.
pub struct Processor {}
impl Processor {

    /// Processes an [Instruction](enum.Instruction.html).
    pub fn process(_program_id: &Pubkey, accounts: &[AccountInfo], input: &[u8]) -> ProgramResult {
        let instruction = HelloWorldInstruction::unpack(input)?;

        match instruction {
            HelloWorldInstruction::Hello {
                message,
            } => {
                msg!("hello-world: HelloWorld");
                Self::process_hello(accounts, message)
            }
            HelloWorldInstruction::Erase=>{
                msg!("hello-world: Erase");
                Self::process_erase(accounts)
            }
        }
    }

    /// Processes an [Hello](enum.HelloWorldInstruction.html) instruction.
    fn process_hello(
        accounts: &[AccountInfo],
        message: String,
    ) -> ProgramResult {

        let account_info_iter = &mut accounts.iter();
        let client_info = next_account_info(account_info_iter)?;
        let message_info = next_account_info(account_info_iter)?;

        // check permission
        if !client_info.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }
        

        let mut state = HelloWorldState::unpack_unchecked(&message_info.data.borrow())?;
        state.account_key = *client_info.key;
        state.message = message;
        
        HelloWorldState::pack(state, &mut message_info.data.borrow_mut())?;

        Ok(())
    }

    /// Processes a [Erase](enum.HelloWorldInstruction.html) instruction.
    pub fn process_erase(accounts: &[AccountInfo]) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let client_info = next_account_info(account_info_iter)?;
        let message_info = next_account_info(account_info_iter)?;


        //check permission
        if !client_info.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }

        let client_starting_lamports = client_info.lamports();
        **client_info.lamports.borrow_mut() = client_starting_lamports + message_info.lamports();
        **message_info.lamports.borrow_mut() = 0;
        Ok(())
    }
}