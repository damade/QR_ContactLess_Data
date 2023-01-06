
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EncryptedField, BlindIndex, CipherSweet, LastFourDigits, StringProvider, FieldStorageTuple } from 'ciphersweet-js'
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class CipherSearchService {

    private bvnProvider = new StringProvider(process.env.CIPHER_BVN_PASSPHRASE)
    private bvnEngine: CipherSweet = new CipherSweet(this.bvnProvider)
    private bvnIndexEngine = (new EncryptedField(this.bvnEngine, 'users', 'bvn'))
        // Add a blind index for the "last 4 of SSN":
        .addBlindIndex(
            new BlindIndex(
                // Name (used in key splitting):
                'user_bvn_last_four',
                // List of Transforms: 
                [new LastFourDigits()],
                // Bloom filter size (bits)
                16
            )
        )
        // Add a blind index for the full SSN:
        .addBlindIndex(
            new BlindIndex(
                'user_bvn',
                [],
                32
            )
        );

        private ninProvider = new StringProvider(process.env.CIPHER_NIN_PASSPHRASE)
        private ninEngine: CipherSweet = new CipherSweet(this.ninProvider)
        private ninIndexEngine = (new EncryptedField(this.ninEngine, 'users', 'nin'))
            // Add a blind index for the "last 4 of SSN":
            .addBlindIndex(
                new BlindIndex(
                    // Name (used in key splitting):
                    'user_nin_last_four',
                    // List of Transforms: 
                    [new LastFourDigits()],
                    // Bloom filter size (bits)
                    16
                )
            )
            // Add a blind index for the full SSN:
            .addBlindIndex(
                new BlindIndex(
                    'user_nin',
                    [],
                    32
                )
            );


    async generateBVNIndex(bvn: string): Promise<string | InternalServerErrorException> {
       const bvnIndexBuilder = await this.bvnIndexEngine.prepareForStorage(bvn);

       const bvnIndex = bvnIndexBuilder[1]['user_bvn']

        return bvnIndex || new InternalServerErrorException("Could Not Generate Index")
    };

    async getBVNIndex(bvn: string): Promise<any> {
        
      const blindIndex = await this.bvnIndexEngine.getBlindIndex(bvn, 'user_bvn')
      
        return blindIndex || new InternalServerErrorException("Could Not Get Index")
     };

    async generateNINIndex(nin: string): Promise<string | InternalServerErrorException> {
        const ninIndexBuilder = await this.ninIndexEngine.prepareForStorage(nin);
        
        const ninIndex = ninIndexBuilder[1]['user_nin_last_four'];
 
         return ninIndex || new InternalServerErrorException("Could Not Generate Index")
     };
 
     async getNINIndex(nin: string): Promise<any> {
    
        const blindIndex = await this.ninIndexEngine.getBlindIndex(nin, 'user_nin_last_four')
  
          return blindIndex || new InternalServerErrorException("Could Not Generate Index")
      };


    
}  