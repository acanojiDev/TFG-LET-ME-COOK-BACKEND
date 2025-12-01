import {prisma} from "../../config/database";
import { CreatePlaceInput, UpdatePlaceInput } from "./places.schema";

export class PlaceService{

    static async createPlace(data: CreatePlaceInput){
        return prisma.places.create({
            data,
        });
    }

    static async getAllPlaces(){
        return await prisma.places.findMany({
            select: {
                name: true,
                address: true,
                description: true,
                tags: true,
                rating: true,
                open: true,
                type:true
            },
        });
    }

    static async getPlaceById(id:string){
        return await prisma.places.findUnique({
            where: {id},
            select: {
                name: true,
                address: true,
                description: true,
                tags: true,
                rating: true,
                open: true,
                type:true
            },
        });
    }

    static async updatePost(id:string, data: UpdatePlaceInput){
        return await prisma.places.update({
            where: { id },
            data,
            select: {
                name: true,
                address: true,
                description: true,
                tags: true,
                rating: true,
                open: true,
                type:true
            },
        });
    }

    static async deletePlace(id: string){
        return await prisma.places.delete({
            where: { id },
        });
    }

}