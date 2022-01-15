import * as THREE from 'https://cdn.skypack.dev/three';
import * as Paho from 'https://cdn.skypack.dev/paho-mqtt';

let _pitch = 0;
let _roll = 0;
let _pitchDiff;
let _rollDiff;


function updatePitchRollText(pitch, roll)
{
    pitch = Number(pitch).toFixed(2);
    roll = Number(roll).toFixed(2);

    const div = document.getElementById("pitchRoll");
    div.innerHTML = `pitch: ${pitch}\u00B0; roll: ${roll}\u00B0`;
}


function mqtt_server_conn() {
    const client = new Paho.Client("localhost", Number(9001), "/ws", "browser");

    client.onMessageArrived = onMessageArrived;

    function onConnect() {
        console.log("Connected to MQTT Server!");
        client.subscribe("$SYS/broker/version");
        client.subscribe("telemetry/tilt");
    }

    client.connect({
        onSuccess: onConnect,
    });

    function onMessageArrived(message) {
        const topic = message.destinationName;

        switch(topic) {
            case "$SYS/broker/version":
                console.log("MQTT broker version: " + message.payloadString);
                break;

            case "telemetry/tilt":
                const [pitch, roll] = message.payloadString.split(";");
                updatePitchRollText(pitch, roll);
                _pitchDiff = pitch - _pitch;
                _rollDiff = roll - _roll;
                _pitch = pitch;
                _roll = roll;
                break;
            
            default:
                console.error("WTF topic: ", + topic);
        }
    }
}


function app() {
    let camera, scene, renderer;
    let geometry, material, mesh;

    init();

    function init() {
        camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
        camera.position.z = 1;

        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0x17202a  );

        geometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
        material = new THREE.MeshNormalMaterial();

        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setAnimationLoop( animation );
        document.body.appendChild( renderer.domElement );
    }

    function animation( time ) {
        if (Math.abs(_pitchDiff) > 3 || Math.abs(_rollDiff) > 3) {
            mesh.rotation.x = THREE.Math.degToRad(_pitch);
            mesh.rotation.y = THREE.Math.degToRad(_roll);
        }
    
        renderer.render( scene, camera );
    }
}

document.addEventListener('DOMContentLoaded', () => {
    mqtt_server_conn();
    app();
});
