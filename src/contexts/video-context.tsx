import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Video {
    id: string;
    name: string;
    url: string; // YouTube URL
    tags: string[];
    lyrics?: string;
    embedUrl?: string; // Calculated field for iframe
}

interface VideoContextType {
    videos: Video[];
    getEmbedUrl: (url: string) => string | undefined;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

const STORAGE_KEY = 'goalritmo_videos_v5';

const getEmbedUrl = (url: string): string | undefined => {
    try {
        let videoId = '';
        if (url.includes('youtube.com/watch')) {
            const urlObj = new URL(url);
            videoId = urlObj.searchParams.get('v') || '';
        } else if (url.includes('youtu.be/')) {
            const parts = url.split('youtu.be/');
            if (parts.length > 1) {
                videoId = parts[1].split('?')[0];
            }
        }
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
    } catch (e) {
        console.error('Error parsing YouTube URL', e);
    }
    return undefined;
};

export const VideoProvider = ({ children }: { children: ReactNode }) => {
    const [videos, setVideos] = useState<Video[]>([]);

    useEffect(() => {
        const defaultVideos: Video[] = [
            {
                id: 'default-1',
                name: 'Paulo Londra - 1% (feat. Eladio Carrión) [Official Video]',
                url: 'https://youtu.be/2yGZPCjtGJ8',
                tags: ['Canción'],
                lyrics: `[PAULO]
Baby, tráeme el alcohol.
Voy a limpiarte las heridas.
Te hablo real como Bellingham.
Para protegerte como Pelican.

El negocio amerita.
A que no viva solo por América.
Y a cada lugar que voy, veo cómo se expande la onda energética.

Llevo más de seis meses sobrio, tú me ves por foto' y es obvio.
La meta está clara, llenar los estadio' a base de amor, nunca del odio.
Primero, segundo y tercero en el podio, Rockefeller, monopolio.
En Ibiza, en el laboratorio, bienvenidos a un nuevo episodio.

No es nada, no es nada, no.
Ustede' no han visto nada, no.
No es nada, no es nada, no.
Lo que logré solo es el 1%.

Entreno como para Juegos Olímpicos.
Lo que aprendo con mi método empírico.
Subo el aura al nivel mítico.
Del camerino se escucha: Lírico.

Le gané a todo' usando lo mínimo (ja, ja).
Mitad artista, mitad científico.
Juego con lo espiritual y lo químico.
Alquimista en la pista, rítmico (uh, uh, wuh).

¿Qué onda, bro? Vos no sabés lo que a mí me costó (no).
Yo sabía que esto iba a doler, pero también que me haría crecer (wuh).
Solo fui a hacer un poco de trícep', ahora saco los palo' con bícep'.
Tú no me querías y ahora me dices: Dale, Paulo, si yo siempre te quise (jajaja).

Mentira, mentira, mentira, siéntate y mira.
Me vas a ver por el Insta de gira, y al que no quiera, que trague saliva (yeah).
Los tiempos de Dios son perfectos, ni siquiera llegó mi momento (amén).
Solo tomé un pre entreno, estoy esperando que me haga el efecto.

Pensaron que era la cima, pero no, pero no.
Pensaron que estaba encima, pero no, pero no.
Me dejan en cero y vuelvo y los parto de nuevo, de nuevo, de nuevo.`,
                embedUrl: getEmbedUrl('https://youtu.be/2yGZPCjtGJ8')
            },
            {
                id: 'default-2',
                name: 'MECHA vs LARRIX I #FMSARGENTINA FINALS 2024/25',
                url: 'https://youtu.be/VBf9ILEq5ts',
                tags: ['Batalla', 'FMS'],
                lyrics: `[MECHA]
No dan el tiempo pero yo entro, eso está muy claro hermano.
Porque tengo los objetos en las manos.
Hoy no tomo fernet, ni estoy pasado.
Pero... pulpito feliz, pulpito enojado.
Qué raro hermano. Eso es la verdad.
Cordobeses en una final? Eso no había pasado jamás.
Pero representamos el rap.
Que nunca haya Córdoba en eventos? Grito "¡Nunca más!".`,
                embedUrl: getEmbedUrl('https://youtu.be/VBf9ILEq5ts')
            },
            {
                id: 'default-3',
                name: 'ACRU "Mi viejo ahora escucha gracias a mi arte” | PLAZA TOMADA',
                url: 'https://youtu.be/7fPSS4PDsrU',
                tags: ['Charla'],
                lyrics: `[ACRU]
Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. 
Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. 
Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. 
Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. 
Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. 
Duis sapien sem, aliquet nec, commodo eget, iaculis quis, ante. 
Phasellus ultrices nulla quis nibh. Quisque a lectus. 
Donec consectetuer ligula vulputate sem tristique cursus.`,
                embedUrl: getEmbedUrl('https://youtu.be/7fPSS4PDsrU')
            }
        ];

        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed.length > 0) {
                    setVideos(parsed);
                    return;
                }
            } catch (e) { }
        }

        setVideos(defaultVideos);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultVideos));
    }, []);

    return (
        <VideoContext.Provider value={{ videos, getEmbedUrl }}>
            {children}
        </VideoContext.Provider>
    );
};

export const useVideos = () => {
    const context = useContext(VideoContext);
    if (!context) {
        throw new Error('useVideos must be used within a VideoProvider');
    }
    return context;
};
