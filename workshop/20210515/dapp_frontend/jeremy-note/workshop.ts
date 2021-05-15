import { Connection, Transaction, PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import bs58 from "bs58";

const connection = new Connection("https://solana-api.projectserum.com");


export const transfer = async (fromAddress:string, toAddress: string, amount: number) => {
    try {
      const from_pubkey = new PublicKey(fromAddress);
      const to_pubkey = new PublicKey(toAddress);
      var tx = SystemProgram.transfer({
        fromPubkey: from_pubkey,
        toPubkey: to_pubkey,
        lamports: amount * LAMPORTS_PER_SOL,
      })
  
      const trx = new Transaction({ feePayer: from_pubkey });
      trx.add(tx);
      const recentHash = await connection.getRecentBlockhash();
      
      trx.recentBlockhash = recentHash.blockhash;
  
      const sig_bytes = await solana_ledger_sign_transaction(transport, solana_derivation_path(), trx);
  
      const sig_string = bs58.encode(sig_bytes);
      console.log("--- len:", sig_bytes.length, "sig:", sig_string);
  
      trx.addSignature(from_pubkey, sig_bytes);
      console.log("--- verifies:", trx.verifySignatures());
  
      const ret = await connection.sendRawTransaction(trx.serialize());
  
      console.log(ret);
    }
  
    catch(e) {
      //chrome.extension.getBackgroundPage().console.log(e);
    }
  }