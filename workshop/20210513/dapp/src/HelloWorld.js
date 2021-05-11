/**
 * @flow
 */

import { 
    PublicKey,
    SystemProgram,
    TransactionInstruction,
    SYSVAR_CLOCK_PUBKEY } from "@solana/web3.js"
import {u64} from '@solana/spl-token'
import * as BufferLayout from 'buffer-layout'

/**
 * HelloWorld
 */
export class HelloWorld {
    static createHelloInstruction(
        playerAccountKey,
        messageAccountKey,
        programID,
        message,
    ) {

        const dataLayout = BufferLayout.struct([
            BufferLayout.u8("i"),
            BufferLayout.blob(message.length,"message"),
        ]);
      
        const data = Buffer.alloc(dataLayout.span);
        dataLayout.encode(
            {
              i:0, // hello
              message: Buffer.from(message, 'utf8'),
            },
            data,
        );
      
        let keys = [
            {pubkey: playerAccountKey, isSigner: true, isWritable: true},
            {pubkey: messageAccountKey, isSigner: true, isWritable: true},
        ];

        const  trxi = new TransactionInstruction({
            keys,
            programId: programID,
            data,
        });
        return trxi;
    }


    static createEraseInstruction(
        playerAccountKey,
        messageAccountKey,
        programID,
        message,
    ) {

        const dataLayout = BufferLayout.struct([
            BufferLayout.u8("i"),
        ]);
      
        const data = Buffer.alloc(dataLayout.span);
        dataLayout.encode(
            {
              i:1, // erase
            },
            data,
        );
      
        let keys = [
            {pubkey: playerAccountKey, isSigner: true, isWritable: true},
            {pubkey: messageAccountKey, isSigner: true, isWritable: true},
        ];

        const  trxi = new TransactionInstruction({
            keys,
            programId: programID,
            data,
        });
        return trxi;
    }
}