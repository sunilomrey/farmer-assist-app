import React, { useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { IconSymbol } from '@/components/ui/icon-symbol';

const { width } = Dimensions.get('window');

const TAB_BAR_MARGIN = 16;
const TAB_BAR_WIDTH = width - TAB_BAR_MARGIN * 2;
const TAB_BAR_HEIGHT = 72;
const TAB_BAR_CORNER_RADIUS = 24;
const HOLE_WIDTH = 90;
const HOLE_DEPTH = 45;
const FAB_SIZE = 64;

const COLORS = {
    background: '#ffffff',
    outline: '#E5E5E5',    // Light stroke edge
    hill: '#C8A96E',       // Project gold color for the floating FAB
    iconInactive: '#8B6F47',// Project brown for inactive icons
    iconActive: '#C8A96E', // Active color for typical tabs (Gold)
    fabIcon: '#ffffff',    // FAB always has white icon inside Gold button
};

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {

    const pathData = useMemo(() => {
        const w = TAB_BAR_WIDTH;
        const h = TAB_BAR_HEIGHT;
        const r = TAB_BAR_CORNER_RADIUS;
        const cx = w / 2;
        // Curve parameters
        const hw = HOLE_WIDTH;
        const hd = HOLE_DEPTH;

        // Draw the top edge with a concave semi-circular hole in the middle.
        // The control points are adjusted to create a smooth 'valley'.
        const path = `
      M 0 ${r}
      A ${r} ${r} 0 0 1 ${r} 0
      L ${cx - hw / 2} 0
      C ${cx - 15} 0, ${cx - 30} ${hd}, ${cx} ${hd}
      C ${cx + 30} ${hd}, ${cx + 15} 0, ${cx + hw / 2} 0
      L ${w - r} 0
      A ${r} ${r} 0 0 1 ${w} ${r}
      L ${w} ${h - r}
      A ${r} ${r} 0 0 1 ${w - r} ${h}
      L ${r} ${h}
      A ${r} ${r} 0 0 1 0 ${h - r}
      Z
    `;
        return path;
    }, []);

    const routes = state.routes;
    const centerRoute = routes.find(r => r.name === 'voice'); // Voice is intended as center

    // Create logical slots to distribute space evenly
    const visualSlots = [
        routes.find(r => r.name === 'index'),
        routes.find(r => r.name === 'crops'),
        null, // Center void space inside Flex container
        routes.find(r => r.name === 'profile'),
        // Add a dummy if missing 5th to keep symmetry, or rely on flex distribution
        null
    ];

    return (
        <View style={styles.wrapper} pointerEvents="box-none">

            {/* Container for the SVG and Flex items */}
            <View style={styles.barContainer}>
                {/* SVG Background with Cutout */}
                <Svg width={TAB_BAR_WIDTH} height={TAB_BAR_HEIGHT} style={styles.svgOverlay}>
                    <Path d={pathData} fill={COLORS.background} stroke={COLORS.outline} strokeWidth={1} />
                </Svg>

                {/* Regular Tabs Container */}
                <View style={styles.tabContainer} pointerEvents="box-none">
                    {visualSlots.map((route, idx) => {
                        if (!route) {
                            // The void space in the middle for the FAB
                            return <View key={`empty-${idx}`} style={styles.voidTab} pointerEvents="none" />;
                        }

                        const { options } = descriptors[route.key];
                        const isFocused = state.routes.findIndex(r => r.key === route.key) === state.index;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });
                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        };

                        return (
                            <TouchableOpacity
                                key={route.key}
                                accessibilityRole="button"
                                accessibilityState={isFocused ? { selected: true } : {}}
                                accessibilityLabel={options.tabBarAccessibilityLabel}
                                onPress={onPress}
                                style={styles.tabButton}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.iconWrapper, isFocused && styles.activeIconIndicator]}>
                                    {options.tabBarIcon
                                        ? options.tabBarIcon({
                                            focused: isFocused,
                                            color: isFocused ? COLORS.iconActive : COLORS.iconInactive,
                                            size: isFocused ? 28 : 24
                                        })
                                        : <IconSymbol size={24} name="circle.fill" color={isFocused ? COLORS.iconActive : COLORS.iconInactive} />}
                                </View>
                                {/* Optional small active dot */}
                                {isFocused && <View style={styles.activeDot} />}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* Floating Action Button (FAB) at the exact structural center, protruding up */}
            {centerRoute && (
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.fab}
                    onPress={() => {
                        const isFocused = state.routes.findIndex(r => r.key === centerRoute.key) === state.index;
                        const event = navigation.emit({ type: 'tabPress', target: centerRoute.key, canPreventDefault: true });
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(centerRoute.name);
                        }
                    }}
                >
                    {(() => {
                        const Icon = descriptors[centerRoute.key].options.tabBarIcon;
                        return Icon
                            ? Icon({
                                focused: true, // Always colorful in FAB
                                color: COLORS.fabIcon, // White inside the gold hill
                                size: 32
                            })
                            : <IconSymbol size={32} name="plus" color={COLORS.fabIcon} />;
                    })()}
                </TouchableOpacity>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 34 : 24,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: TAB_BAR_HEIGHT + 30, // Extra height allows the FAB to protrude from the box
    },
    barContainer: {
        width: TAB_BAR_WIDTH,
        height: TAB_BAR_HEIGHT,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
    },
    svgOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    tabContainer: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: TAB_BAR_HEIGHT,
    },
    voidTab: {
        width: HOLE_WIDTH * 0.8, // Reserve physical space in the flex-row for the hole
        height: TAB_BAR_HEIGHT,
    },
    iconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
    },
    activeIconIndicator: {
        transform: [{ translateY: -2 }], // Slight pop up on active
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.iconActive,
        marginTop: 4,
        position: 'absolute',
        bottom: 12,
    },
    fab: {
        position: 'absolute',
        top: 5, // Sits high up, overlapping the cutout perfectly
        width: FAB_SIZE,
        height: FAB_SIZE,
        borderRadius: FAB_SIZE / 2,
        backgroundColor: COLORS.hill,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.hill,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 4,
        borderColor: '#ffffff', // Clean white ring between the hill and the canvas creates perfect cutout illusion
    }
});
