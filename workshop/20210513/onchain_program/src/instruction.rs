//! Instruction types

use crate::error::HelloWorldError;
use solana_program::{
    program_error::ProgramError,
};
use std::mem::size_of;
use std::str::from_utf8;

/// Instructions supported by the hello-world program.
#[repr(C)]
#[derive(Clone, Debug, PartialEq)]
pub enum HelloWorldInstruction {
    /// Hello print hello to an Account file
    Hello{
        /// message for hello
        message: String,
    },
    /// Erase free the hello account 
    Erase ,
}


impl HelloWorldInstruction {
    /// Unpacks a byte buffer into a [HelloWorldInstruction](enum.HelloWorldInstruction.html).
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        use HelloWorldError::InvalidInstruction;

        let (&tag, rest) = input.split_first().ok_or(InvalidInstruction)?;
        Ok(match tag { //HelloWorld
            0 => {
                let message= String::from(from_utf8(rest).unwrap());
                Self::Hello{
                    message,
                }
            },
            1 => Self::Erase,

            _ => return Err(HelloWorldError::InvalidInstruction.into()),
        })
    }

    /// Packs a [HelloWorldInstruction](enum.HelloWorldInstruction.html) into a byte buffer.
    pub fn pack(&self) -> Vec<u8> {
        let mut buf : Vec<u8>;
        let self_len= size_of::<Self>();
        match self {
            &Self::Hello{
                ref message,
            } => {
                buf = Vec::with_capacity(self_len+1);
                buf.push(0); // tag
                buf.extend_from_slice(message.as_bytes());
            }
            Self::Erase => {
                buf = Vec::with_capacity(self_len);
                buf.push(1); //tag
            }
        };
        buf
    }    
}