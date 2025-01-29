import { PrismaClient } from '@prisma/client';

let prismaClient: PrismaClient ;

const getPrismaClient = () => {

    if(prismaClient) {
        return prismaClient;
    }

    prismaClient = new PrismaClient();

    return prismaClient;
}

export default getPrismaClient;