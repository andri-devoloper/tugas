'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Gurus from '@/components/Guru';
import { Suspense } from 'react';

export default function GuruPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Ambil kunci akses dari search params
        const accessKey = searchParams.get('key');

        // Periksa apakah kunci akses sesuai
        if (accessKey !== 'mySecretKey123') {
            // Arahkan pengguna ke halaman error atau halaman lain
            router.push('/error');
        }
    }, [router, searchParams]);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div>
                <Gurus />
            </div>
        </Suspense>
    );
}
