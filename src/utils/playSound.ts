export enum SoundName {
	BallHit = 'audio-ball-hit'
}

export function playSound(soundName: SoundName, volume = 1) {
	const audio = document.getElementById(soundName) as HTMLAudioElement;
	if (!audio) {
		throw new Error(`Audio not found: ${soundName}`);
	}
	audio.pause();
	audio.volume = volume
	audio.currentTime = 0;
	audio.play();
}
