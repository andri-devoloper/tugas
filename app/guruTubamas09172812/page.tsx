

import Gurus from '@/components/Guru';
import Upload from '@/components/Upload';


export default function GuruPage() {

    return (
        <div className='flex flex-row'>
            <div>
                <Gurus />
            </div>
            <div>
                <Upload />
            </div>
        </div>
    );
}
