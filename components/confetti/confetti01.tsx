import { Canvas, Circle, Group, Path, Skia } from "@shopify/react-native-skia";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect } from "react";
import { useWindowDimensions } from "react-native";
import Animated, {
  useSharedValue,
  useDerivedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  withRepeat,
  runOnJS,
} from "react-native-reanimated";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  color: string;
  shape: "circle" | "square" | "strip";
  scale: number;
  opacity: number;
}

const PARTICLE_COUNT = 100;
const GRAVITY = 0.5;
const INITIAL_VELOCITY = 20;
const PARTICLE_SIZE = 10;
const COLORS = [
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffff00",
  "#ff00ff",
  "#00ffff",
  "#FFA500",
  "#800080",
];

const generateRandomPosition = (width: number, height: number) => {
  const x = Math.random() * width;
  const y = -PARTICLE_SIZE;
  return { x, y };
};

const Confetti01 = () => {
  const { width, height } = useWindowDimensions();
  const animation = useSharedValue(0);
  const particles = useSharedValue<Particle[]>([]);

  const createParticles = useCallback(() => {
    const newParticles: Particle[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI - Math.PI / 2;
      const velocity = INITIAL_VELOCITY * (0.8 + Math.random() * 0.4);
      const shape =
        Math.random() < 0.33
          ? "circle"
          : Math.random() < 0.66
            ? "square"
            : "strip";
      const position = generateRandomPosition(width, height);

      newParticles.push({
        ...position,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        rotation: Math.random() * 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape,
        scale: 0.5 + Math.random() * 1,
        opacity: 0.7 + Math.random() * 0.3,
      });
    }

    particles.value = newParticles;
  }, [width, height]);

  const updateParticles = useCallback(() => {
    const progress = animation.value;
    const currentParticles = [...particles.value];

    const updatedParticles = currentParticles.map((particle) => {
      const wave = Math.sin(progress * 2 + particle.x / 50) * 2;

      return {
        ...particle,
        x: particle.x + particle.vx + wave,
        y: particle.y + particle.vy + GRAVITY * progress * particle.scale,
        rotation: particle.rotation + particle.vx * 2,
        opacity: Math.max(0, particle.opacity - progress * 0.001),
      };
    });

    // Reset particles that go off screen
    updatedParticles.forEach((particle, index) => {
      if (particle.y > height + PARTICLE_SIZE) {
        const position = generateRandomPosition(width, height);
        updatedParticles[index] = {
          ...particle,
          ...position,
          opacity: 0.7 + Math.random() * 0.3,
        };
      }
    });

    particles.value = updatedParticles;
  }, [width, height]);

  const particleRenderData = useDerivedValue(() => {
    return particles.value;
  }, []);

  const setup = () => {
    createParticles();
    animation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000 }),
        withTiming(0, { duration: 0 }),
      ),
      -1,
      true,
    );
  };

  useFocusEffect(useCallback(setup, []));

  // useEffect(() => {
  //   createParticles();
  //   animation.value = withRepeat(
  //     withSequence(
  //       withTiming(1, { duration: 3000 }),
  //       withTiming(0, { duration: 0 }),
  //     ),
  //     -1,
  //     true,
  //   );
  // }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      runOnJS(updateParticles)();
    }, 16);

    return () => clearInterval(interval);
  }, [updateParticles]);

  return (
    <Canvas style={{ width, height }}>
      <Group>
        {particleRenderData.value.map((particle, index) => {
          if (particle.shape === "circle") {
            return (
              <Circle
                key={index}
                cx={particle.x}
                cy={particle.y}
                r={(PARTICLE_SIZE / 2) * particle.scale}
                color={particle.color}
                opacity={particle.opacity}
              />
            );
          } else if (particle.shape === "square") {
            const path = Skia.Path.Make();
            path.addRect({
              x: (-PARTICLE_SIZE / 2) * particle.scale,
              y: (-PARTICLE_SIZE / 2) * particle.scale,
              width: PARTICLE_SIZE * particle.scale,
              height: PARTICLE_SIZE * particle.scale,
            });
            return (
              <Group
                key={index}
                transform={[
                  { translateX: particle.x },
                  { translateY: particle.y },
                  { rotate: particle.rotation },
                ]}
              >
                <Path
                  path={path}
                  color={particle.color}
                  opacity={particle.opacity}
                />
              </Group>
            );
          } else {
            const path = Skia.Path.Make();
            path.addRect({
              x: -PARTICLE_SIZE * particle.scale,
              y: (-PARTICLE_SIZE / 6) * particle.scale,
              width: PARTICLE_SIZE * 2 * particle.scale,
              height: (PARTICLE_SIZE / 3) * particle.scale,
            });
            return (
              <Group
                key={index}
                transform={[
                  { translateX: particle.x },
                  { translateY: particle.y },
                  { rotate: particle.rotation },
                ]}
              >
                <Path
                  path={path}
                  color={particle.color}
                  opacity={particle.opacity}
                />
              </Group>
            );
          }
        })}
      </Group>
    </Canvas>
  );
};

export default Confetti01;
