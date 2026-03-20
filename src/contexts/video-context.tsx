import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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

const STORAGE_KEY = "bzrp_sessions_v7";

const getEmbedUrl = (url: string): string | undefined => {
  try {
    if (!url) return undefined;
    let videoId = "";
    if (url.includes("youtube.com/watch")) {
      const urlObj = new URL(url);
      videoId = urlObj.searchParams.get("v") || "";
    } else if (url.includes("youtu.be/")) {
      const parts = url.split("youtu.be/");
      if (parts.length > 1) {
        videoId = parts[1].split("?")[0];
      }
    }
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch (e) {
    console.error("Error parsing YouTube URL", e);
  }
  return undefined;
};

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const daddyYankeeLyrics = `Daddy Yankee! || ¡Daddy Yankee!

A new season has started, hit play (play) || Nueva temporada ya empezó, dale play (play)
Bass is thumping, Bizarrap, feel that bass || Sonido del bajo, Bizarrap, suena el bass
Code 787, a.k.a El Calentón || Código 787, alias El Calentón
Bring in the drums, 'cause reggaeton just came on || Pon la batería, que llegó el reggaeton

What is good has entered your home || Que lo bueno se metió pa' tu casa
A King without mystery, lifting up His people || Rey sin misterio levantando la raza
I walk with the power that breaks all evil || Ando con el poder que to' los male' arrasa
Everyone's asking me: What's going on? || To' el mundo me dice: ¿Qué te pasa?

If you ask me, I owe nobody a thing || Si me pregunta', a nadie yo le debo
When I leave this place, I'm taking nothing || Cuando me vaya de aquí, nada me llevo
Just leaving with a true love in my heart || Solo me voy con un amor verdadero
Feet on the ground, always looking to Heaven || Los pie' en la tierra, siempre mirando al cielo

Daddy! || ¡Daddy!

The kid's sharp, you can tell he's from the hood || Fino es el chamaco y se le nota el barrio
My flow's eternal, no longer just legendary || Mi flow es eterno, ya no es legendario
I ain't talking dollars, but I bring the change || No te 'toy hablando de dólar, pero traigo el cambio
It's my Father who fills up the stadium || Es mi Father quien llena el estadio

With me on all the paths, the one who brings the vitamin || Conmigo pa' tos' lao' camina, es quién me pone la vitamina
The real gasoline, -line (fire up the engines) || La verdadera gasolina, -lina (prendan los motore')
Doesn't leave me hanging on the corner, from Santurce to Argentina || No me deja para'o en la esquina, de Santurce pa' Argentina
What do you want me to say? || ¿Qué tú quiere' que te diga?

If you ask me, I owe nobody a thing || Si me pregunta', a nadie yo le debo
When I leave this place, I'm taking nothing || Cuando me vaya de aquí, nada me llevo
Just leaving with a true love in my heart || Solo me voy con un amor verdadero
Feet on the ground, always looking to Heaven || Los pie' en la tierra, siempre mirando al cielo

Massive! || ¡Masivo!
(start the engines) || (Prendan los motore')
Fire! || ¡Fuego!

Bi-Bi-Biza, get your visa (what?) || Bi-Bi-Biza, búscate la visa (what?)
That's the one on top, enemies don't give a heads up (what?) || Que sea la de arriba, que el enemigo no avisa (what?)
You're seeing a man rising from the ashes (what?) || Están viendo un hombre que renace de las ceniza' (what?)
Nothing stops this, not even the border patrol, ready || Esto no lo para ni la patrulla fronteriza, stop

A new season has started, hit play || Nueva temporada ya empezó, dale play
Bass is thumping, Bizarrap, feel that bass || Sonido del bajo, Bizarrap, suena el bass
Code 787, a.k.a El Calentón || Código 787, alias El Calentón
Bring in the drums, 'cause reggaeton just came on || Pon la batería, que llegó el reggaeton

What is good has entered your home || Que lo bueno se metió pa' tu casa
A King without mystery, lifting up His people || Rey sin misterio levantando la raza
I walk with the power that breaks all evil || Ando con el poder que to' los male' arrasa
Everyone's asking me: What's going on? || To' el mundo me dice: ¿Qué te pasa?

If you ask me, I owe nobody a thing || Si me pregunta', a nadie yo le debo
When I leave this place, I'm taking nothing || Cuando me vaya de aquí, nada me llevo
Just leaving with a true love in my heart || Solo me voy con un amor verdadero
Feet on the ground, always looking to Heaven || Los pie' en la tierra, siempre mirando al cielo

Fire! || ¡Fuego!
Fire! || ¡Fuego!
(Play that mambo so my girls start the engines!) || (Zúmbale mambo pa' que mis gatas prendan los motore')
(Start the engines) || (Prendan los motore')

Bizarrap || Bizarrap`;

    const createSession = (
      num: number,
      artist: string,
      videoId: string = "",
      tags: string[] = [],
      lyrics: string = "Letra en proceso...",
    ): Video => {
      const url = videoId ? `https://www.youtube.com/watch?v=${videoId}` : "";
      return {
        id: `bzrp-${num}`,
        name: `${artist.toUpperCase()} || BZRP Music Sessions #${num < 10 ? `0${num}` : num}`,
        url,
        tags: ["Session", "BZRP", ...tags],
        lyrics,
        embedUrl: getEmbedUrl(url),
      };
    };

    const defaultVideos: Video[] = [
      createSession(0, "DADDY YANKEE", "qNw8ejrI0nM", [], daddyYankeeLyrics),
      createSession(1, "BHAVI", "ybo9fpwTFto"),
      createSession(2, "ECKO", "Es7IKbFoDHc"),
      createSession(3, "PACO AMOROSO", "-smN6ZUHzgk"),
      createSession(4, "BLUNTED VATO", "-iLUtxzR4ds"),
      createSession(5, "Pekeño 77", "J5lloRbf2RQ"),
      createSession(6, "KODIGO", "pRNL60WXF3w"),
      createSession(7, "DREFQUILA", "t8nB0Fyx69A"),
      createSession(8, "ZANTO", "aEeoXjmQinU"),
      createSession(9, "DILLOM", "QGDqhpnrIqI"),
      createSession(10, "FRIJO", "7MJvKW2KVJQ"),
      createSession(11, "KIDDO TOTO", "1iZ999P03KU"),
      createSession(12, "MESITA", "Gu7l77nCfZY"),
      createSession(13, "NICKI NICOLE", "gW165h1-AZE"),
      createSession(14, "CA7RIEL", "TzUdpcNV-Q8"),
      createSession(15, "ALEMÁN", "zj6R6foXaKI"),
      createSession(16, "TRUENO", "SSuTme04Bys"),
      createSession(17, "KINDER MALO", "LI5dh5zCKi0"),
      createSession(18, "JOHN C", "o42797MbLRI"),
      createSession(19, "POLIMA WESTCOAST", "cWfOVzXiAQE"),
      createSession(20, "LOUTA", "HdGDLqRQNII"),
      createSession(21, "NEUTRO SHORTY", "gTRdmsEeCUU"),
      createSession(22, "LALO EBRATT", "exuRTyiNbYU"),
      createSession(23, "PAULO LONDRA", "WkgHkrM9fo0"),
      createSession(24, "DANI", "LDtABz-5Ka4"),
      createSession(25, "DON PATRICIO", "joNX1WcXUck"),
      createSession(26, "LUCHO SSJ", "X7KC9J-ArdQ"),
      createSession(27, "BEJO", "TGPQOAmx8ko"),
      createSession(28, "BIG SOTO", "G5Wng8W8S8A"),
      createSession(29, "C.R.O", "Nb_lsnx8BoQ"),
      createSession(30, "HOMER EL MERO MERO", "HzCuP2xvu-I"),
      createSession(31, "Zaramay", "4OKgRMRDusM"),
      createSession(32, "CAZZU", "prU2g7PBTxs"),
      createSession(33, "SEVEN KAYNE", "Dmqpcz0OfPw"),
      createSession(34, "KHEA", "QAf-SvxZIx0"),
      createSession(35, "ASAN", "QAkRObfMBhk"),
      createSession(36, "NATHY PELUSO", "0OkiUUU3Odw"),
      createSession(37, "YSY A", "HbeLYtQqkIg"),
      createSession(38, "L-Gante", "z7rI82hyels"),
      createSession(39, "Snow Tha Product", "t490zXLrQDE"),
      createSession(40, "Eladio Carrión", "s5cYXknsDbY"),
      createSession(41, "Nicky Jam", "BH6T3CTuncc"),
      createSession(42, "?", ""),
      createSession(43, "Chucky73", "r63YPAW2G9M"),
      createSession(44, "MHD", "of_3rje8oKA"),
      createSession(45, "PTAZETA", "yLX87IkvT8I"),
      createSession(46, "ANUEL AA", "O5Vd-I1gd7Y"),
      createSession(47, "MORAD", "FsF3o9XNcN8"),
      createSession(48, "TIAGO PZK", "h7U8TqOVyxc"),
      createSession(49, "RESIDENTE", "HO73gUhiYe0"),
      createSession(50, "DUKI", "Gzs60iBgd3E"),
      createSession(51, "VILLANO ANTILLANO", "wvz97-lNPH8"),
      createSession(52, "QUEVEDO", "A_g3lMcWVy0"),
      createSession(53, "SHAKIRA", "CocEMWdc7Ck"),
      createSession(54, "ARCANGEL", "ntCZjb_AAWE"),
      createSession(55, "PESO PLUMA", "v5_SYkFpFiY"),
      createSession(56, "RAUW ALEJANDRO", "HWZhoK-2cG8"),
      createSession(57, "MILO J", "_6XzJPyAJDI"),
      createSession(58, "YOUNG MIKO", "NaoNcERVF78"),
      createSession(59, "Natanael Cano", "kRlxTJSPKK8"),
      createSession(60, "Lismar", "8onM1VDoTSs"),
      createSession(61, "Luck Ra", "GJtrE-SLtZA"),
      createSession(62, "J BALVIN", "imfr5Px5D54"),
      createSession(63, "?", ""),
      createSession(64, "?", ""),
      createSession(65, "?", ""),
      createSession(66, "?", ""),
    ];

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) {
          setVideos(parsed);
          return;
        }
      } catch (e) {}
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
    throw new Error("useVideos must be used within a VideoProvider");
  }
  return context;
};
