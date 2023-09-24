export enum SoundName {
	BallHit = 'audio-ball-hit'
}

export function playSound(soundName: SoundName) {
	const audio = document.getElementById(soundName) as HTMLAudioElement;
	if (!audio) {
		throw new Error(`Audio not found: ${soundName}`);
	}
	audio.pause();
	audio.currentTime = 0;
	audio.play();
}
