import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const superbase = createClient(supabaseUrl, supabaseAnonKey);

export default function mediaUpload(file: any) {

    return new Promise((resolve, reject) => {

        if (file === null) {
            reject("No File Selected");
        }


        const timestamp = new Date().getTime();
        const fileName = timestamp + file.name;
        superbase.storage.from("images").upload(fileName, file, { cacheControl: '3600', upsert: false }).then(() => {

            const publicUrl = superbase.storage.from("images").getPublicUrl(fileName).data.publicUrl;
            resolve(publicUrl)
        }).catch((e) => {
            console.log(e);
            reject("Upload Failed");
        })


    });



}