import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Fonts, Images, Layout } from '../constants';

const Sponsor = props => {
  const imageStyle = props.isLow ? styles.lowTier : {};

  return (
    <TouchableOpacity
      style={styles.sponsor}
      onPress={() => Linking.openURL(props.url)}>
      <Image style={imageStyle} source={props.image} />
    </TouchableOpacity>
  );
};

const Sponsors = () => {
  return (
    <View style={styles.sponsors}>
      <Text style={styles.heading}>Our Sponsors</Text>
      <Text style={styles.description}>
        We love the sponsors for this conference. They make all of this fun
        stuff possible, and we couldn’t have done it without them.
      </Text>

      <Text style={styles.sponsorTierTitle}>Platinum Sponsors</Text>
      <View style={styles.sponsorTier}>
        <Sponsor
          url={'https://www.squarespace.com/'}
          image={Images.squarespace}
        />
      </View>

      <Text style={styles.sponsorTierTitle}>Gold Sponsors</Text>
      <View style={styles.sponsorTier}>
        <Sponsor url={'https://nativebase.io/'} image={Images.nativeBase} />
        <Sponsor url={'https://formidable.com/'} image={Images.formidable} />
        <Sponsor url={'https://moduscreate.com/'} image={Images.modus} />
        <Sponsor url={'https://www.bugsnag.com/'} image={Images.bugsnag} />
      </View>

      <Text style={styles.sponsorTierTitle}>Silver Sponsors</Text>
      <View style={styles.sponsorTier}>
        <Sponsor url={'https://aws.amazon.com/'} image={Images.amazon} isLow />
        <Sponsor
          url={'http://reactnative.training/'}
          image={Images.training}
          isLow
        />
        <Sponsor url={'https://rangle.io/'} image={Images.rangle} isLow />
        <Sponsor url={'https://gudog.co.uk/'} image={Images.gudog} isLow />
        <Sponsor
          url={'http://www.oregon4biz.com'}
          image={Images.businessOregon}
          isLow
        />
        <Sponsor
          url={'http://www.healthsparq.com/'}
          image={Images.healthsparq}
          isLow
        />
      </View>

      <Text style={styles.sponsorTierTitle}>Bronze Sponsors</Text>
      <View style={styles.sponsorTier}>
        <Sponsor url={'https://echobind.com/'} image={Images.echobind} isLow />
        <Sponsor
          url={'https://www.capitalone.com/'}
          image={Images.capitalOne}
          isLow
        />
        <Sponsor
          url={'https://www.salesforce.com/'}
          image={Images.salesforce}
          isLow
        />
        <Sponsor
          url={'https://www.paypal.com/us/home'}
          image={Images.paypal}
          isLow
        />
        <Sponsor
          url={'https://www.instrument.com/'}
          image={Images.instrument}
          isLow
        />
        <Sponsor url={'http://www.qlik.com/us/'} image={Images.qlik} />
        <Sponsor url={'https://callstack.io/'} image={Images.callstack} isLow />
        <Sponsor url={'https://www.mlssoccer.com/'} image={Images.mls} isLow />
      </View>

      <Text style={styles.sponsorTierTitle}>Additional Sponsors</Text>
      <View style={styles.sponsorTier}>
        <Sponsor url={'http://www.qlik.com/us/'} image={Images.qlikCoffee} />
      </View>
    </View>
  );
};

export default Sponsors;

const styles = StyleSheet.create({
  sponsors: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingBottom: 50,
    paddingTop: 30,
    backgroundColor: Colors.transparent,
  },
  heading: {
    marginTop: 14,
    fontFamily: Fonts.type.bold,
    fontSize: 31,
    letterSpacing: 0.2,
    backgroundColor: Colors.transparent,
    color: Colors.snow,
  },
  description: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Medium',
    fontSize: 15,
    color: '#FDE5FF',
    letterSpacing: 0.47,
    lineHeight: 23,
  },
  sponsorTierTitle: {
    marginTop: 60,
    marginBottom: Layout.baseMargin,
    fontFamily: Fonts.type.bold,
    fontSize: 15,
    color: Colors.snow,
    opacity: 0.6,
    letterSpacing: 0.5,
    lineHeight: 23,
  },
  sponsorTier: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: Layout.screenWidth,
    flexWrap: 'wrap',
  },
  sponsor: {
    margin: 15,
    flexShrink: 0,
    alignItems: 'center',
  },
  lowTier: {
    marginHorizontal: 25,
  },
});
