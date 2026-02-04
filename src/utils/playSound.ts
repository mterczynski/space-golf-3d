export enum SoundName {
	// BallHit = 'audio-ball-hit',
	BallHit = "audio-ping-pong-ball-hit",
	BallFlightStart = "audio-ball-flight-start",
	Ambient = "audio-ambient",
}

export const playSound = {
	ballHit: (volume = 1) => playAudioTrack(SoundName.BallHit, { volume }),
	ballFlightStart: (volume = 0.5) =>
		playAudioTrack(SoundName.BallFlightStart, {
			volume,
			startTimeMS: 800,
			stopTimeMS: 1000,
		}),
	ambient: () => playAudioTrack(SoundName.Ambient, { volume: 0.5 }),
};

interface AudioTrackOptions {
	volume?: number;
	startTimeMS?: number;
	stopTimeMS?: number;
}

function playAudioTrack(soundName: SoundName, { volume = 1, startTimeMS = 0, stopTimeMS }: AudioTrackOptions) {
	const audio = document.getElementById(soundName) as HTMLAudioElement;
	if (!audio) {
		throw new Error(`Audio not found: ${soundName}`);
	}
	audio.pause();
	audio.volume = volume;
	audio.currentTime = startTimeMS / 1000;
	audio.play();

	// todo - fix potential bugs with cancelling timeout of other sound playback
	if (typeof stopTimeMS === "number") {
		setTimeout(function () {
			audio.pause();
		}, stopTimeMS);
	}
}
