export class CreateToken {
   id: bigint;
   token: string;
   userId: bigint;
   type: string;
   expireAt: Date;
   createdAt: Date;
   usedAt: Date;
}